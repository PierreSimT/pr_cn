#include <stdio.h>
#include <string.h>
#include "mpi/mpi.h"

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
    dato = 10;
    for (i = 1; i < size; i++) {
      dato = dato + i;
      rc = MPI_Send(&dato, 1, MPI_INT, i, tag, MPI_COMM_WORLD);
    }
    dato = 10;
  } 
  else 
    rc = MPI_Recv(&dato, 1, MPI_INT, 0, tag, MPI_COMM_WORLD, &status);

  printf( "node %d : %d\n", rank, dato);
  rc = MPI_Finalize();
}


