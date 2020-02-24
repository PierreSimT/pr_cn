#include <stdio.h>
#include <string.h>
#include "mpi/mpi.h"
/**
 * Modificacion de hellomsint_orig.c para que 
 * los esclavos envien el dato con una suma
 */

int main(int argc, char **argv)
{
  int rank, size, tag, rc, i;
  int dato;
  MPI_Status status;

  rc = MPI_Init(&argc, &argv);
  rc = MPI_Comm_size(MPI_COMM_WORLD, &size);
  rc = MPI_Comm_rank(MPI_COMM_WORLD, &rank);
  tag = 100;
	  
  if(rank == 0) {
    for (i = 1; i < size; i++) {
      dato = dato + i;
      rc = MPI_Recv(&dato, 1, MPI_INT, i, tag, MPI_COMM_WORLD, &status);
      printf( "node %d : %d\n", rank, dato);

    }
  } 
  else {
    dato = 10 + rank;
    rc = MPI_Send(&dato, 1, MPI_INT, 0, tag, MPI_COMM_WORLD);
  }

  rc = MPI_Finalize();
}


