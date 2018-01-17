#include"Matrix.h"
using namespace std;
//void getgroup(int **Matrix,int Vs,int n,int *group,int groupnum)
//{
//	int i,j;
//		for(j=0;j<n;j++)
//		{
//			if(Matrix[Vs][j]!=0)
//			{		
//				group[j]=groupnum;
//				Matrix[j][Vs]=0;
//				Matrix[Vs][j]=0;
//				getgroup(Matrix,j,n,group,groupnum);
//			}
//		}
//}
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