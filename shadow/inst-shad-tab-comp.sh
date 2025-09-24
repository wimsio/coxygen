#!/usr/bin/env bash
set -euo pipefail

#--Company : Coxygen Global
#--Author  : Bernard Sibanda
#--Date    : 2024-06-20
#--Purpose : Install 'shadow' wrapper for shadow.mjs (all README commands) + tab-completion
#--License : MIT

APP_NAME="shadow"
WRAPPER_NAME="$APP_NAME"
PREFERRED_BIN="$HOME/.local/bin"
FALLBACK_BIN="$HOME/bin"

info()  { printf "\033[1;34m[INFO]\033[0m %s\n" "$*"; }
ok()    { printf "\033[1;32m[OK]\033[0m %s\n" "$*"; }
warn()  { printf "\033[1;33m[WARN]\033[0m %s\n" "$*"; }
err()   { printf "\033[1;31m[ERR]\033[0m %s\n" "$*"; }

append_once() { # append a block to a file if the exact block isn't already present
  local file="$1" block="$2"
  grep -Fq "$block" "$file" 2>/dev/null || printf '\n%s\n' "$block" >> "$file"
}

usage() {
  cat <<EOF
Usage: $0 [--shadow /absolute/path/to/shadow.mjs]

If --shadow is not provided, tries to auto-detect:
  1) ./shadow.mjs
  2) <installer_dir>/shadow.mjs
  3) First match under ~ (depth 5)

Creates a 'shadow' wrapper in ~/.local/bin (or ~/bin) and installs tab completion.
EOF
}

SHADOW_PATH="${1:-}"
if [[ "${SHADOW_PATH:-}" == "--help" || "${SHADOW_PATH:-}" == "-h" ]]; then usage; exit 0; fi
if [[ "${SHADOW_PATH:-}" == "--shadow" ]]; then SHADOW_PATH="${2:-}"; shift 2 || true; fi

# --- verify node ---
command -v node >/dev/null || { err "Node.js not found"; exit 1; }

# --- resolve shadow.mjs ---
detect_shadow() {
  local here="$(pwd)" me="$(realpath "$0")" mydir="$(dirname "$me")"
  if [[ -z "${SHADOW_PATH:-}" ]]; then
    if   [[ -f "$here/shadow.mjs" ]]; then SHADOW_PATH="$(realpath "$here/shadow.mjs")"
    elif [[ -f "$mydir/shadow.mjs" ]]; then SHADOW_PATH="$(realpath "$mydir/shadow.mjs")"
    else
      info "Searching ~ for shadow.mjs …"
      local found
      if found="$(find "$HOME" -maxdepth 5 -type f -name 'shadow.mjs' 2>/dev/null | head -n1)"; then
        SHADOW_PATH="$(realpath "$found")"
      fi
    fi
  fi
  [[ -z "${SHADOW_PATH:-}" ]] && { err "shadow.mjs not found"; exit 1; }
  ok "Using shadow.mjs: $SHADOW_PATH"
}
detect_shadow

# --- choose bin dir ---
BIN_DIR="$PREFERRED_BIN"
mkdir -p "$BIN_DIR" || { warn "Falling back to $FALLBACK_BIN"; BIN_DIR="$FALLBACK_BIN"; mkdir -p "$BIN_DIR"; }
ok "Install directory: $BIN_DIR"

WRAPPER_PATH="$BIN_DIR/$WRAPPER_NAME"

# --- write wrapper ---
cat > "$WRAPPER_PATH" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
SHADOW_PATH="%SHADOW_PATH%"

if [[ "${1:-}" == "--commands" ]]; then
  cat <<'CMDS'
🔑 Wallet & Contracts:
  gen-wallet [--mainnet]
  compile <contract.hl> [--mainnet] [--staking] [--nft] [--show-cli]

🧮 Encoding & Conversion:
  hex-encode "text"
  hex-decode <hex>
  str-to-hex "text"
  hex-to-str <hex>
  str-to-bin "text"
  bin-to-str "bits"
  hex-to-bin <hex>
  bin-to-hex "bits"
  bytes-to-text <hex>

🖋 Sign & Verify:
  signHex <hex-msg> <payment.skey>
  signMessage "text" <payment.skey>
  verifyHex <hex> <signatureHex> <payment.vkey>
  verify <hex> <signatureHex> <payment.vkey>
  verifyMessage "text" <signatureHex> <payment.vkey>   [⚠ missing implementation]

📦 Bech32 Tools:
  addrBech32-to-pkh <addr>
  addrBech32-to-binary <addr>
  addrBech32-to-hex <addr>
  addrBech32-to-address <addr>

🌐 Flags:
  --mainnet   --staking   --nft   --show-cli

Other:
  --help      --commands   doctor
CMDS
  exit 0
fi

if [[ "${1:-}" == "doctor" ]]; then
  echo "[Doctor] Scanning shadow.mjs …"
  missing=0
  grep -q 'function[[:space:]]\+verifyMessage' "$SHADOW_PATH" || { echo "⚠ verifyMessage referenced but not defined"; missing=1; }
  grep -q 'FULL_HELP' "$SHADOW_PATH" || { echo "⚠ FULL_HELP referenced but not defined"; missing=1; }
  [[ $missing -eq 0 ]] && echo "✅ Looks good!"
  exit $missing
fi

# Default behavior
if [[ $# -eq 0 ]]; then
  exec node "$SHADOW_PATH" --help
elif [[ "$1" == *.hl || "$1" == *.helios ]]; then
  exec node "$SHADOW_PATH" compile "$@"
else
  exec node "$SHADOW_PATH" "$@"
fi
EOF

# inject shadow path
sed -i "s|%SHADOW_PATH%|$(printf %q "$SHADOW_PATH")|g" "$WRAPPER_PATH"
chmod +x "$WRAPPER_PATH"
ok "Installed wrapper: $WRAPPER_PATH"

# --- PATH updates ---
line='export PATH="$HOME/.local/bin:$HOME/bin:$PATH"'
append_once "$HOME/.bashrc" "$line"
append_once "$HOME/.zshrc"  "$line"
ok "PATH ensured for bash/zsh"

# --- tab-completion (bash + zsh) ---
CMDS="addrBech32-to-pkh addrBech32-to-binary addrBech32-to-hex addrBech32-to-address gen-keys signHex signMessage verifyMessage verifyHex verify hex-encode hex-decode str-to-hex hex-to-str str-to-bin bin-to-str hex-to-bin bin-to-hex gen-wallet compile bytes-to-text --help --commands doctor"
FLAGS="--mainnet --staking --nft --show-cli"

read -r -d '' BASH_COMP <<'BASHCOMP'
# >>> shadow completion start >>>
_shadow_complete() {
  local cur prev
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"

  local __CMDS="__CMDS__"
  local __FLAGS="__FLAGS__"

  if [[ $COMP_CWORD -eq 1 ]]; then
    COMPREPLY=( $(compgen -W "$__CMDS" -- "$cur") )
    return 0
  fi

  case "${COMP_WORDS[1]}" in
    compile)
      if [[ -z "$cur" || "$cur" == scripts/* ]]; then
        COMPREPLY=( $(compgen -W "$(ls scripts/*.hl 2>/dev/null)" -- "$cur") )
      else
        COMPREPLY=( $(compgen -f -X '!*.hl' -- "$cur") )
      fi
      ;;
    signHex|verifyHex|verify|signMessage|verifyMessage)
      COMPREPLY=( $(compgen -f -- "$cur") $(compgen -W "$__FLAGS" -- "$cur") )
      ;;
    *)
      COMPREPLY=( $(compgen -W "$__FLAGS" -- "$cur") )
      ;;
  esac
}
complete -F _shadow_complete shadow
# <<< shadow completion end <<<
BASHCOMP

read -r -d '' ZSH_COMP <<'ZSHCOMP'
# >>> shadow completion start >>>
#compdef shadow
local -a cmds flags
cmds=( __CMDS__ )
flags=( __FLAGS__ )

_shadow_files() {
  if [[ $words[2] == compile ]]; then
    _files -g 'scripts/*.hl' -g '*.hl'
  else
    _files
  fi
}

_arguments -C \
  '1:command:->cmds' \
  '*::args:_shadow_files'

case $state in
  cmds) _describe 'command' cmds ;;
esac
# <<< shadow completion end <<<
ZSHCOMP

# inject command/flag lists
BASH_COMP="${BASH_COMP//__CMDS__/$CMDS}"
BASH_COMP="${BASH_COMP//__FLAGS__/$FLAGS}"
ZSH_COMP="${ZSH_COMP//__CMDS__/$CMDS}"
ZSH_COMP="${ZSH_COMP//__FLAGS__/$FLAGS}"

append_once "$HOME/.bashrc" "$BASH_COMP"
append_once "$HOME/.zshrc"  "$ZSH_COMP"
ok "Tab completion installed (bash & zsh)"

cat <<'EON'
----------------------------------------
✅ shadow CLI installed.

Reload shell:
  source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null
  hash -r

Try:
  shadow --commands
  shadow doctor
  shadow compile scripts/always_succeed.hl
  shadow addrBech32-to-pkh <bech32>
  shadow signHex <hex> payment.skey

Tip: press <Tab> after 'shadow ' or 'shadow compile ' for completions.
----------------------------------------
EON
