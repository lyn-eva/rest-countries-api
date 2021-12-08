// 1 2 3 4
// 1 2 3 4
// 1 2 3 4

let ary = [[1,2,3,4], [1,2,3,4], [1,2,3,4]];
let path = [], ind, t=0, row = ary.length-1, col = ary[0].length-1;
for (i=0; i<=col; i++) {
   path.push(ary[0][i]);
   ary[0][i] = "*";
}
console.log(path, ary);
for (i=0; i<=row; i++) {
   path.push(ary[i][col]);
   ary[i][col] = "*";
}
console.log(path, ary);

while (true) {
   if(t%2 == 0) {
      for (i=0; i<=col; i++) {
         if (ary[0][i] != "*")
         {
            path.push(ary[0][i]);
            ary[0][i] = "*";
            col = i;
         }
         // if (t == 2 or t%)
      }
   }
   else {
      for (i=0; i<=row; i++) {
         if (ary[i][col] != "*") {
            path.push(ary[i][col]);
            ary[i][col] = "*";
            row = i;
         }
      }
   }
   t++;
}