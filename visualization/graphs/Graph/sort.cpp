#include"sort.h"
#include<iostream>
#include<fstream>
#include<sstream>
#include<vector>
using namespace std;
extern Node* head2;
extern Node* head;

void makeList2(char *movie,char *id)//movie - id-id-id
{                                   //movie - id-id-id 
	Node *p;
	Node *q;
	Node *temp;
	temp=new Node;
	p=NULL;
	strcpy(temp->id,id);
	strcpy(temp->movie,movie);
	if(head2==NULL)
	{
		head2=temp;
		temp->nextid=p;
		temp->nextmovie=p;
		cout<<temp->movie;
	}
	q=head2;
	while(1)
	{
		if(strcmp(q->movie,movie)==0)//if two movies are the same one
		{
			while(1)
			{
				if(strcmp(q->id,temp->id)==0)
				{
					return;
				}
				if(q->nextid==NULL)//if the sameone,save it in same line;
				{                    
					q->nextid=temp;	  
					temp->nextid=p;   
					return;
				}
					else 
				{
					q=q->nextid;
				}
			}
		}
		else
		{
			if(q->nextmovie!=NULL)
			{
				q=q->nextmovie;
			}
			else
			{
				q->nextmovie=temp;
				temp->nextmovie=p;
				temp->nextid=p;
				return;
			}
		}
	}
}
void makeList(char *movie,char *id)//people watched which movies
{                                  //id - movie movie movie
	Node *p;                       //id - movie movie movie
	Node *q;
	Node *first;
	Node *temp;

	temp=new Node;
	p=NULL;
	strcpy(temp->id,id);
	strcpy(temp->movie,movie);
	if(head==NULL)
	{
		head=temp;
	}
	else
	{
	q=head;
	while(1)
	{
		if(strcmp(q->id,id)==0)//if two id is the same one
		{	
			first=q;
			while(1)
			{
				if(strcmp(q->movie,temp->movie)==0)
				{
					return;
				}
				if(q->nextmovie==NULL)//if the sameone,save it in same line
				{
					q->nextmovie=temp;		
					return;
				}
					else 
				{
					q=q->nextmovie;
				}
			}
		}
		else
		{
			if(q->nextid!=NULL)
			{
				q=q->nextid;
			}
			else
			{
				q->nextid=temp;
				return;
			}
		}
	}
	}
}

int idnum=0;
vector<char *> movie_title;
void giveID(char *movie, Node *node)//give id to each movies
{
	Node *p;
	Node *q;
	Node *temp;
	temp =new Node;
	strcpy(temp->movie,movie);
	p=node;
	if(p==NULL)
	{
		p=temp;
	}
	else
		while(1)
		{
			if(strcmp(p->movie,movie)==0)
			{
				return;
			}	
			if(p->nextmovie==NULL)
			{
				temp->idnumber=idnum;
				movie_title.push_back(temp->id);
				idnum++;
				p->nextmovie=temp;
				return;
			}		
			else
			{
				p=p->nextmovie;
			}
		}	
}