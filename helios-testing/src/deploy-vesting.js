import * as helios from "./helios.js"

const vestingSrc = await Deno.readTextFile("./src/vesting.hl");
const program = helios.Program.new(vestingSrc);
const simplify = false;
const uplcProgram = program.compile(simplify);

const vHash = uplcProgram.validatorHash;
console.log("vesting hash: ", vHash.hex);
console.log("vesting address: ", helios.Address.fromValidatorHash(vHash).toBech32());

await Deno.writeTextFile("./deploy/vesting.plutus", uplcProgram.serialize());
await Deno.writeTextFile("./deploy/vesting.hash", vHash.hex);
await Deno.writeTextFile("./deploy/vesting.addr", helios.Address.fromValidatorHash(vHash).toBech32());
