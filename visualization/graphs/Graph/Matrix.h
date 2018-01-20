#ifndef MATRIX_H
#define MATRIX_H
#include"Node.h"
#include<sstream>
#include<fstream>

void v_MAT(int **v_next,int **v_weight, Node *key, Node *saveid);
void getgroup(int **Matrix,int Vs,int n,int *group,int groupnum);
int getID(Node *key, Node *saveid);
void ergodic(Node *id,int **v_nextMAT,int **v_weightMAT,Node *saveid);
void prim(int **v_weightMAT, int n);
#endif