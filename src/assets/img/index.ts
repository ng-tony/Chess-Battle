import bb from "./bb.svg";
import bk from "./bk.svg";
import bn from "./bn.svg";
import bp from "./bp.svg";
import bq from "./bq.svg";
import br from "./br.svg";
import bz from "./blank.svg";
import wb from "./wb.svg";
import wk from "./wk.svg";
import wn from "./wn.svg";
import wp from "./wp.svg";
import wq from "./wq.svg";
import wr from "./wr.svg";
import wz from "./blank.svg";

import Guard from "./guard.svg";
import Shield from "./shield.svg";
import Sword from "./sword.svg";
import Flail from "./flail.svg";
import Clear from "./blank.svg";

export const pieceImages = { bb, bk, bn, bp, bq, br, bz, wb, wk, wn, wp, wq, wr, wz}
export const powerUpImages = { Guard, Shield, Sword, Flail, Clear };

export type PieceImageKey = keyof typeof pieceImages;
export type PowerUpImageKey = keyof typeof powerUpImages;
