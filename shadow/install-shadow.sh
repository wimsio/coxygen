#!/usr/bin/env bash
set -euo pipefail

#--Company : Coxygen Global
#--Author  : Bernard Sibanda
#--Date    : 2024-06-20
#--Purpose : Install 'shadow' wrapper for shadow.mjs (supports all README commands)
#--License : MIT

APP_NAME="shadow"
WRAPPER_NAME="$APP_NAME"
PREFERRED_BIN="$HOME/.local/bin"
FALLBACK_BIN="$HOME/bin"

info()  { printf "\033[1;34m[INFO]\033[0m %s\n" "$*"; }
ok()    { printf "\033[1;32m[OK]\033[0m %s\n" "$*"; }
warn()  { printf "\033[1;33m[WARN]\033[0m %s\n" "$*"; }
err()   { printf "\033[1;31m[ERR]\033[0m %s\n" "$*"; }

usage() {
  cat <<EOF
Usage: $0 [--shadow /absolute/path/to/shadow.mjs]

If --shadow is not provided, the script tries to auto-detect:
  1) ./shadow.mjs (current dir)
  2) <installer_dir>/shadow.mjs
  3) First match from: find ~ -maxdepth 5 -name shadow.mjs

Creates a 'shadow' wrapper in ~/.local/bin (or ~/bin), ensures PATH, and
adds optional Bash/Zsh completion.
EOF
}

SHADOW_PATH="${1:-}"
if [[ "${SHADOW_PATH:-}" == "--help" || "${SHADOW_PATH:-}" == "-h" ]]; then usage; exit 0; fi
if [[ "${SHADOW_PATH:-}" == "--shadow" ]]; then SHADOW_PATH="${2:-}"; shift 2 || true; fi

# --- verify node ---
if ! command -v node >/dev/null 2>&1; then
  err "Node.js not found in PATH. Please install Node and retry."
  exit 1
fi

# --- resolve shadow.mjs ---
detect_shadow() {
  local here; here="$(pwd)"
  local me;   me="$(realpath "$0")"
  local mydir; mydir="$(dirname "$me")"

  if [[ -z "${SHADOW_PATH:-}" ]]; then
    if [[ -f "$here/shadow.mjs" ]]; then
      SHADOW_PATH="$(realpath "$here/shadow.mjs")"
    elif [[ -f "$mydir/shadow.mjs" ]]; then
      SHADOW_PATH="$(realpath "$mydir/shadow.mjs")"
    else
      info "Searching for shadow.mjs under \$HOME (this may take a moment)…"
      local found
      if found="$(find "$HOME" -maxdepth 5 -type f -name 'shadow.mjs' 2>/dev/null | head -n1)"; then
        [[ -n "$found" ]] && SHADOW_PATH="$(realpath "$found")"
      fi
    fi
  fi

  if [[ -z "${SHADOW_PATH:-}" ]]; then err "Could not locate shadow.mjs automatically."; echo; usage; exit 1; fi
  if [[ ! -f "$SHADOW_PATH" ]]; then err "shadow.mjs not found at: $SHADOW_PATH"; exit 1; fi
  ok "Using shadow.mjs at: $SHADOW_PATH"
}
detect_shadow

# --- choose bin dir ---
BIN_DIR="$PREFERRED_BIN"
mkdir -p "$BIN_DIR" || { warn "Could not create $PREFERRED_BIN, falling back to $FALLBACK_BIN"; BIN_DIR="$FALLBACK_BIN"; mkdir -p "$BIN_DIR"; }
ok "Install directory: $BIN_DIR"

WRAPPER_PATH="$BIN_DIR/$WRAPPER_NAME"

# --- write wrapper ---
cat > "$WRAPPER_PATH" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
SHADOW_PATH="%SHADOW_PATH%"

# Help/commands provided by wrapper too:
if [[ "${1:-}" == "--commands" ]]; then
  cat <<'CMDS'
Supported commands (pass-through to shadow.mjs):

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
  verifyHex <hex-msg> <signatureHex> <payment.vkey>
  verify <hex-msg> <signatureHex> <payment.vkey>   # alias of verifyHex
  verifyMessage "text" <signatureHex> <payment.vkey>   # NOTE: your JS references verifyMessage but no handler is defined

📦 Bech32 Tools:
  addrBech32-to-pkh <addr>
  addrBech32-to-binary <addr>
  addrBech32-to-hex <addr>
  addrBech32-to-address <addr>

Global flags (parsed by shadow.mjs):
  --mainnet   --staking   --nft   --show-cli
CMDS
  exit 0
fi

if [[ "${1:-}" == "doctor" ]]; then
  echo "[Doctor] Checking shadow.mjs for potential issues…"
  missing=0
  if ! grep -qE 'function[[:space:]]+verifyMessage' "$SHADOW_PATH"; then
    echo "  - WARN: 'verifyMessage' is referenced in CLI but no function is defined."
    missing=1
  fi
  if ! grep -qE 'FULL_HELP' "$SHADOW_PATH"; then
    echo "  - WARN: 'FULL_HELP' is referenced but not defined (only HELP_TEXT exists)."
    missing=1
  fi
  if [[ $missing -eq 0 ]]; then echo "  ✅ Looks good!"; fi
  exit $missing
fi

# Behavior:
# - No args        -> show help from the JS
# - First arg *.hl -> default to 'compile <file>'
# - Otherwise      -> pass through all args as subcommand(s)
if [[ $# -eq 0 ]]; then
  exec node "$SHADOW_PATH" --help
elif [[ "${1:-}" == *.hl || "${1:-}" == *.helios ]]; then
  exec node "$SHADOW_PATH" compile "$@"
else
  exec node "$SHADOW_PATH" "$@"
fi
EOF

# inject real path
sed -i "s|%SHADOW_PATH%|$(printf %q "$SHADOW_PATH")|g" "$WRAPPER_PATH"
chmod +x "$WRAPPER_PATH"
ok "Installed wrapper: $WRAPPER_PATH"

# --- ensure PATH in shells ---
append_once() {
  local file="$1" line="$2"
  if [[ -f "$file" ]] && grep -Fq "$line" "$file"; then return 0; fi
  printf '\n%s\n' "$line" >> "$file"
}

added_export_line='export PATH="$HOME/.local/bin:$HOME/bin:$PATH"'
append_once "$HOME/.bashrc" "$added_export_line" || true
append_once "$HOME/.zshrc"  "$added_export_line" || true
ok "Ensured ~/.local/bin and ~/bin are in PATH (bash/zsh)."

# --- optional: simple tab-completion for bash/zsh ---
COMPLETIONS="addrBech32-to-pkh addrBech32-to-binary addrBech32-to-hex addrBech32-to-address gen-keys signHex signMessage verifyMessage verifyHex verify hex-encode hex-decode str-to-hex hex-to-str str-to-bin bin-to-str hex-to-bin bin-to-hex gen-wallet compile bytes-to-text --help --commands doctor"
BASH_COMP='
_shadow_complete() {
  local cur="${COMP_WORDS[COMP_CWORD]}"
  COMPREPLY=( $(compgen -W "__WORDS__" -- "$cur") )
}
complete -F _shadow_complete shadow
'
ZSH_COMP='
#compdef shadow
_arguments "*: :((__WORDS__))"
'

append_once "$HOME/.bashrc" "${BASH_COMP/__WORDS__/$COMPLETIONS}" || true
append_once "$HOME/.zshrc"  "${ZSH_COMP/__WORDS__/$COMPLETIONS}"  || true
ok "Added simple tab completion (bash/zsh)."

# --- post-install advice ---
cat <<'EON'
----------------------------------------
✅ Installation complete.

To start using the command NOW:
  source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null || true
  hash -r

Examples (pass-through to shadow.mjs):
  shadow addrBech32-to-pkh <bech32>
  shadow addrBech32-to-binary <bech32>
  shadow addrBech32-to-hex <bech32>
  shadow addrBech32-to-address <bech32>
  shadow gen-keys 123 --mainnet
  shadow signHex <hex> payment.skey
  shadow signMessage "hello" payment.skey
  shadow verifyHex <hex> <signatureHex> payment.vkey
  shadow verify <hex> <signatureHex> payment.vkey
  shadow hex-encode "Hello"
  shadow hex-decode 48656c6c6f
  shadow str-to-hex "Hello"
  shadow hex-to-str 48656c6c6f
  shadow str-to-bin "text"
  shadow bin-to-str "01110100 01100101 01111000 01110100"
  shadow hex-to-bin 74657874
  shadow bin-to-hex "01110100 01100101 01111000 01110100"
  shadow gen-wallet --mainnet
  shadow compile scripts/always_succeed.hl
  shadow bytes-to-text 48656c6c6f
  shadow --help
  shadow --commands
  shadow doctor   # checks verifyMessage/FULL_HELP presence
----------------------------------------
EON
