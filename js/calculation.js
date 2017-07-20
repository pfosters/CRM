/**
 * Created by RoGGeR on 17.07.17.
 */


var MB= [[],[]];
var MC= [[],[]];
var MD= [[],[]];
function SplineKoeff(index, mass)
{

    var C=[];
    var B=[];
    var D=[];
    var num=mass.length;
    var n=num-1;
    var NM1=n-1;

    if(num<2) return false;
    if(num<3){
        B[0]=(mass[1][1]-mass[0][1])/(mass[1][0]-mass[0][0]);
        C[0] = 0;
        D[0] = 0;
        B[1] = B[0];
        C[1] = 0;
        D[1] = 0;
        MB[index] = B;
        MC[index] = C;
        MD[index] = D;
        return;
    }
    else
    {
        D[0]=mass[1][0]-mass[0][0];
        C[1] = (mass[1][1] - mass[0][1]) / D[0];
        for (var i = 1; i < NM1+1; i++) {//цикл ебашит на ура
            D[i] = mass[i + 1][0] - mass[i][0]; //охуенно работает
            B[i]=2*(D[i-1]+D[i]);//охуенно работает
            C[i + 1] = (mass[i + 1][1] - mass[i][1]) / D[i];
            C[i] = C[i + 1] - C[i];
        };
        B[0] = -D[0];
        B[n] = -D[n - 1];
        C[0] = 0;
        C[n] = 0;
        if(num==3){
            for (var i = 1; i < n+1; i++) {
                var T = D[i-1] / B[i-1];
                B[i] = B[i] - T * D[i-1];
                C[i] = C[i] - T * C[i-1];
            };
            C[n] = C[n] / B[n];
            for (var IB = 1; IB < n+1; i++) {
                var i = n - IB;
                C[i] = (C[i] - D[i] * C[i + 1]) / B[i];
            };

            B[n] = (mass[n][1] - mass[NM1][1]) / D[NM1] + D[NM1] * (C[NM1] + 2 * C[n]);
            for (var i = 0; i < NM1+1; i++) {
                B[i] = (mass[i + 1][1] - mass[i][1]) / D[i] - D[i] * (C[i + 1] + 2 * C[i]);
                D[i] = (C[i + 1] - C[i]) / D[i];
                C[i] = 3 * C[i];
            };

            C[n] = 3 * C[n];
            D[n] = D[n - 1];
            MB[index] = B;
            MC[index] = C;
            MD[index] = D;
        }
        else{
            C[0] = C[2] / (mass[3][0] - mass[1][0]) - C[1] / (mass[2][0] - mass[0][0]);


            C[n] = C[n - 1] / (mass[n][0] - mass[n - 2][0]) - C[n - 2] / (mass[n - 1][0] - mass[n - 3][0]);
            C[0] = C[0] * Math.pow(D[0], 2) / (mass[3][0] - mass[0][0]);
            C[n] = -C[n] * Math.pow(D[n-1], 2) / (mass[n][0] - mass[n - 3][0]);
            for (var i = 1; i < n+1; i++) {

                var T = D[i-1] / B[i-1];
                B[i] = B[i] - T * D[i-1];
                C[i] = C[i] - T * C[i-1];
            };
            C[n] = C[n] / B[n];
            for (var IB = 1; IB < n+1; IB++) {
                var i = n - IB;
                C[i] = (C[i] - D[i] * C[i + 1]) / B[i];
            };
            B[n] = (mass[n][1] - mass[NM1][1]) / D[NM1] + D[NM1] * (C[NM1] + 2 * C[n]);
            for (var i = 0; i < NM1+1; i++) {
                B[i] = (mass[i + 1][1] - mass[i][1]) / D[i] - D[i] * (C[i + 1] + 2 * C[i]);
                D[i] = (C[i + 1] - C[i]) / D[i];

                C[i] = 3 * C[i];
            };
            C[n] = 3 * C[n];
            D[n] = D[n - 1];
            MB[index] = B;
            MC[index] = C;
            MD[index] = D;
        }

    }
}
function Spline(U, mass, index){

    var n=mass.length-1;
    var i=0;
    if(i>=n+1){
        i=0;
    }

    if(mass[i][0]>U){
        i=0;
        var J = n+1;//24
        var k;
        do{
            k=Math.round((i+J)/2);

            if(U<mass[k][0]){
                J=k;
            }
            if(U>=mass[k][0]){
                i=k;
            };
        }while(J>i+1);
        var dx=U-mass[i][0];
        var Spline1=mass[i][1]+dx*(MB[index][i]+dx*(MC[index][i]+dx*MD[index][i]));
        return Spline1;
    }

    if(U<=mass[i+1][0])
    {
        var dx=U-mass[i][0];
        var Spline1=mass[i][1]+dx*(MB[index][i]+dx*(MC[index][i]+dx*MD[index][i]));
        return Spline1;
    }
    else{
        i=0;
        var J = n+1;//24
        var k;
        do{
            k=Math.round((i+J)/2);//12
            if(U<mass[k][0]){
                J=k;
            }
            if(U>=mass[k][0]){
                i=k;
            };
            var g=i+1;

        }while(J>i+1);
        var dx=U-mass[i][0];
        var Spline1=mass[i][1]+dx*(MB[index][i]+dx*(MC[index][i]+dx*MD[index][i]));
        return Spline1;

    }

}
function Franchise(cost, franchise){
    if(franchise<cost){

        return 1-Math.pow(franchise/cost, 0.5);
    }
    else if(franchise>=cost) return 0;
}




function BubbleSort(mass)       // A - массив, который нужно
{
    var A=[];
    for(var key in mass){
        A.push(mass[key]);
    }

                   // отсортировать по возрастанию.
    var n = A.length;
    for (var i = 0; i < n-1; i++){
        for (var j = 0; j < n-1-i; j++){
            if (A[j+1][0] < A[j][0]){
                var t = A[j+1]; A[j+1] = A[j]; A[j] = t;
            }
        }
    }
    return A;    // На выходе сортированный по возрастанию массив A.
}


//function Limit - перенесена в transportation_calc.js из-за плавающего коэффициента