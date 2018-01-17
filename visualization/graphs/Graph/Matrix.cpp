#include"Matrix.h"
#include"Node.h"

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