#ifndef NODE_H
#define NODE_H
#include<iostream>
class Node
{
public:
	char movie[100];
	char id[100];
	Node *nextmovie;
	Node *nextid;
	int  idnumber;
	Node()
	{
		memset(movie,NULL,sizeof(movie));
		memset(id,NULL,sizeof(id));
		nextmovie=NULL;
		nextid=NULL;
		idnumber=-1;
	}
	void makelist(char *movie,char *id);
	void makelist2(char *movie,char *id);
};

#endif