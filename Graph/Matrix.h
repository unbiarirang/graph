#ifndef MATRIX_H
#define MATRIX_H
#include"Node.h"
#include<sstream>
#include<fstream>

void v_MAT(int **v_next,int **v_weight, Node *key, Node *saveid);

int getID(Node *key, Node *saveid);
void ergodic(Node *id,int **v_nextMAT,int **v_weightMAT,Node *saveid);
#endif