public boolean isAvgGreaterThan(int[] list, int num ) {
//int[] list = {1,2,3,4,5};

//sum of total
int total = 0;
for (int i = 0; i < list.length; i++)
  total = total + list[i];
  double average = total / list.length;

if (average>= num) {
return true
}
else {
return false
}
}
