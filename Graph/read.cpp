#include"read.h"
#include<iostream>
#include<sstream>
#include<fstream>
#include"Node.h"
#include"sort.h"
#include<vector>
#include"Matrix.h"
using namespace std;
Node *head;
Node *head2;
extern int idnum;
void readdata()
{
	ifstream inputStream;
	char buffer[1000]={NULL};
	char movie[100]={NULL};
	char id[100]={NULL};
	head=NULL;
	head2=NULL;
	Node *saveid;
	saveid=new Node;
	int k=0;
	cout<<"Ready to make id-movie-movie list and give id to movies"<<endl;
	inputStream.open("user.csv");
	 if (! inputStream.is_open())  
       { cout << "Error opening file"; exit (1); }  
		 while (!inputStream.eof() )  
		{  
			int j=0;
			int sw=0;
			memset(movie,NULL,sizeof(movie));
			memset(id,NULL,sizeof(id));
			inputStream.getline(buffer,1000);
			for(int i=0;i<strlen(buffer);i++)
			{
				if(buffer[i]==',')
				{
					sw=1;
					j=0;
				}
				else if(sw==0)
				{
					movie[j]=buffer[i];
					j++;
				}
				else if(sw==1)
				{
					id[j]=buffer[i];//divide the setence to id and movie
					j++;
				}
			}	
			giveID(movie,saveid);
			makeList(movie,id);
		 }
		 cout<<"id-movie-movie list has been made"<<endl;
		  saveid=saveid->nextmovie;
		  int **v_next;
		  int **v_weight;
		  v_next=new int*[idnum];
		  v_weight=new int*[idnum];
		  for(int i=0;i<idnum;i++)
		  {
		  v_next[i]=new int[idnum];
		  v_weight[i]=new int[idnum];
		  }
		  for(int i=0;i<idnum;i++)
		   for(int j=0;j<idnum;j++)
		   {
			 v_next[i][j]=0;
		     v_weight[i][j]=0;
		   }
		   cout<<"ready to make matrix"<<endl;
		  v_MAT(v_next,v_weight,head,saveid);
		  ofstream outputStream("Links.json");
		  	if(outputStream.is_open())
			{
				outputStream<<"\"Links\": [\n";
			}
			for(int i=0;i<idnum;i++)
			for(int j=0;j<idnum;j++)
			{
				if(v_next[i][j]!=0)
				{
		  			if(outputStream.is_open())
					{
						outputStream<<"\"source\": \""<<i<<"\", \"target\": \""<<j<<"\",\"value\":"<<v_weight[i][j]<<"},\n";
						v_next[j][i]=0;
					}
				}
			}
			outputStream<<"]";

		 //p=node;
		 //ofstream out("movie_id.json");
		 //if (out.is_open())   
			//  {  
			//	out<<"\"movies\":\n";
		 //      }	
		 //while(1)
		 //{
			//if(p==NULL)
			//	break;
			// if (out.is_open())   
			//  {  
			//	  out<<"{\"id\":"<<p->idnumber<<",\"title\":\""<<p->movie<<"\"}\n";
		 //      }	
			//	p=p->nextmovie;
		 //}  //output json
	/*	  for(int i=0;i<idnum;i++)
		  {
			  for(int j=0;j<idnum;j++)
			  {
				cout<<v_next[i][j]<<" ";
			  }
			cout<<endl;
		  }*/
}

