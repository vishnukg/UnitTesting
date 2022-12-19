import { MaitreD } from "./maitreD/maitred";
import { MaitreDV2 } from "./maitreD/maitredV2";

// Composition Root
//
// Pure DI
//
const maitreD = new MaitreD(10);

console.log(maitreD.getTotalCapacity());
