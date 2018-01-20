#include"Matrix.h"
#include"Node.h"
#define MAX 10000;
void v_MAT(int **v_next,int **v_weight, Node *key,Node *saveid)
{
	Node *tmp;
	Node *head;
	head=key;

	while(1)
	{
			if(head==NULL)
				break;
			else
			{
				ergodic(head,v_next,v_weight,saveid);
				head=head->nextid;
			}
	 }
}
//key is the form of    
//id1 - movie1 movie2 movie3
//id2 - movie1 movie2 movie3
//so movies in the same line is the side of each other;
int getID(Node *saveid, Node *key)
{
	Node *tmp;
	tmp=saveid;
	while(1)
	{
		if(strcmp(tmp->movie,key->movie)==0)
		{
			return tmp->idnumber;
		}
		else
		{
			tmp=tmp->nextmovie;
		}
	}
}
void ergodic(Node *id, int **v_next,int **v_weight,Node *saveid)
{
	Node *tmp;
	Node *head;
	head=id;
	while(1)
	{
		tmp=head;
		tmp=tmp->nextmovie;
		while(1)
		{
			if(tmp==NULL)
			{
				head=head->nextmovie;
				break;
			}
			else
			{
				v_next[getID(saveid,head)][getID(saveid,tmp)]=1;
				v_next[getID(saveid,tmp)][getID(saveid,head)]=1;
				v_weight[getID(saveid,head)][getID(saveid,tmp)]++;
				v_weight[getID(saveid,tmp)][getID(saveid,head)]++;
				tmp=tmp->nextmovie;
			}
	     }
			if(head==NULL)
				break;
	}
}

void prim(int **v_weightMAT,int n,int *group,int start)
{
	int *mindst;
	int *MST;
	int i,j,min,minid;
	mindst=new int[n+1];
	MST=new int[n+1];
	mindst[start]=0;
	for(int i=start+1;i<n+1;i++)
	{
		mindst[i]=v_weightMAT[start+1][i];
		MST[i]=start;
	}
	MST[start]=0;
	for(i=start+1;i<n+1;i++)
	{
		min=MAX;
		minid=0;
		for(j=0;j<n+1;j++)
		{
			if(mindst[j]<min&&mindst[j]!=0)
			{
				min=mindst[j];
				minid=j;
			}
		}
		
	}
}