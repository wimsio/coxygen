#!/usr/bin/env bash
set -euo pipefail

#--Company : Coxygen Global
#--Author  : Bernard Sibanda
#--Date    : 2024-06-20
#--Purpose : Install 'shadow' wrapper for shadow.mjs (all README commands)
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

If --shadow is not provided, tries to auto-detect:
  1) ./shadow.mjs
  2) <installer_dir>/shadow.mjs
  3) First match under ~ (depth 5)

Creates a 'shadow' wrapper in ~/.local/bin (or ~/bin).
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
    if [[ -f "$here/shadow.mjs" ]]; then
      SHADOW_PATH="$(realpath "$here/shadow.mjs")"
    elif [[ -f "$mydir/shadow.mjs" ]]; then
      SHADOW_PATH="$(realpath "$mydir/shadow.mjs")"
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
append_once() { local file="$1" line="$2"; grep -Fq "$line" "$file" 2>/dev/null || echo "$line" >> "$file"; }
line='export PATH="$HOME/.local/bin:$HOME/bin:$PATH"'
append_once "$HOME/.bashrc" "$line"
append_once "$HOME/.zshrc"  "$line"

ok "PATH ensured for bash/zsh"

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
----------------------------------------
EON
