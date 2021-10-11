import {cyclic} from "./number";

export function fastDirX(len: number, dir: number){
    return len*fastCos(dir);
}
export function fastDirY(len: number, dir: number){
    return -len*fastSin(dir);
}

/**Approximation to the sine. Up to 25% faster than Math.cos.*/
export function fastSin(angle: number)
{
    return fastCos(Math.PI/2-angle);
}
/**Approximation to the cosine. Up to 25% faster than Math.cos.*/
export function fastCos(angle: number)
{
    const z = cyclic(2*angle/Math.PI, 0,4);
    if(z < 1)
    return fc(z);
else if(z < 2)
    return -fc(2-z);
else if(z < 3)
    return -fc(z-2);
else
    return fc(4-z);
}

function fc(z: number)
{
    return 1-z*z*((2-Math.PI/4)-z*z*(1-Math.PI/4));
}
