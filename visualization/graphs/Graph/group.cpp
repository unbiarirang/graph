#include"Matrix.h"
using namespace std;

void getgroup(int **Matrix,int Vs,int n,int *group,int groupnum) 
{
    group[Vs] = groupnum;
    for (int i = 0; i < n;i++) 
	{
        int to = Matrix[Vs][i];
        if(group[to]==0)
		{
			getgroup(Matrix,to,n,group,groupnum);
		}
    }
}