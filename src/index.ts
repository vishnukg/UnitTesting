import { MaitreD } from "./maitreD/maitred";

// Composition Root
//
// Pure DI
//
const maitred = new MaitreD(10);

console.log(maitred.getTotalCapacity());
