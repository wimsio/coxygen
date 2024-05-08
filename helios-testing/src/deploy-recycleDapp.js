import * as helios from "./helios.js"

const recycleDappSrc = await Deno.readTextFile("./src/recycleDapp.hl");
const program = helios.Program.new(recycleDappSrc);
const simplify = false;
const uplcProgram = program.compile(simplify);

const vHash = uplcProgram.validatorHash;
console.log("recycleDapp hash: ", vHash.hex);
console.log("recycleDapp address: ", helios.Address.fromValidatorHash(vHash).toBech32());

await Deno.writeTextFile("./deploy/recycleDapp.plutus", uplcProgram.serialize());
await Deno.writeTextFile("./deploy/recycleDapp.hash", vHash.hex);
await Deno.writeTextFile("./deploy/recycleDapp.addr", helios.Address.fromValidatorHash(vHash).toBech32());
