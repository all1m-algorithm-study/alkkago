import { Co, FRICTION_CONST, INF, MIN_VELOCITY, Piece, RADIUS } from "./api";

export function getUnitVector(angle: number): Co {
    return new Co(
        Math.cos(angle*Math.PI/180),
        Math.sin(angle*Math.PI/180)
    );
}

export function updateMovement(source: Piece, deltaTime: number) {
    if (!source.active) {
        return;
    }

    const initSpeed = source.vel.getNorm();
    let finalSpeed = initSpeed - FRICTION_CONST * deltaTime;
    
    if (finalSpeed < MIN_VELOCITY) {
        source.active = false;
        finalSpeed = 0;
    }

    source.setVel(source.vel.getUnitVector().mulScalar(finalSpeed));
    const averageSpeed = (initSpeed + finalSpeed) / 2;
    const deltaLocation = source.vel.getUnitVector().mulScalar(averageSpeed * deltaTime);
    source.loc = source.loc.addVector(deltaLocation);
}

export function updateCollision(source: Piece, target: Piece) {
    if (!checkCollision(source, target)) {
        return;
    }

    source.active = true;
    target.active = true;

    const r = target.loc.subVector(source.loc).getUnitVector();
    const deltaVelocity = r.mulScalar(source.vel.subVector(target.vel).getInnerProduct(r));

    source.vel = source.vel.subVector(deltaVelocity);
    target.vel = target.vel.addVector(deltaVelocity);
}

export function checkCollision(source: Piece, target: Piece): boolean {
    return source.loc.subVector(target.loc).getNorm() < 2 * RADIUS;
}

export function findCollisionDistance(black: Piece, white: Piece): number {
    const R = white.loc.subVector(black.loc).getNorm();
    const RCos = white.loc.subVector(black.loc).getInnerProduct(black.vel) / black.vel.getNorm();
    const RCosx = Math.sqrt(R*R - 4*RADIUS*RADIUS);

    if (RCos < RCosx) {
        return INF;
    }

    const determine = 4*RADIUS*RADIUS + RCos*RCos - R*R;
    return determine < 0 ? INF : (RCos - Math.sqrt(determine));
}

export function initialize(black: Piece, distanceMoved: number) {
    const determine = Math.pow(black.vel.getNorm(), 2) - 2*FRICTION_CONST*distanceMoved;
    if (determine < 0 || Math.sqrt(determine) < MIN_VELOCITY) {
        black.active = false;
        return;
    }

    const newSpeed = Math.sqrt(determine);
    black.setVel(black.vel.getUnitVector().mulScalar(newSpeed));
    
    const deltaLocation = black.vel.getUnitVector().mulScalar(distanceMoved);
    black.setLoc(black.loc.addVector(deltaLocation));
}