#include "mpi.h"
#include <stdio.h>
#include <string.h>

int main(int argc, char **argv) {
  int rank, size, tag, rc, i;
  MPI_Status status;
  char message[20];

  rc = MPI_Init(&argc, &argv);
  rc = MPI_Comm_size(MPI_COMM_WORLD, &size);
  rc = MPI_Comm_rank(MPI_COMM_WORLD, &rank);
  tag = 100;

  if (size > 1) {
    if (rank == 0) {
      printf("Numero de procesadores a recorrer: %d\n", size);
      strcpy(message, "Hello, world");

      rc = MPI_Send(message, 13, MPI_CHAR, 1, tag, MPI_COMM_WORLD);

      printf("Maestro esperando que mensaje recorra el anillo\n");
      rc = MPI_Recv(message, 13, MPI_CHAR, size - 1, tag, MPI_COMM_WORLD,
                    &status);

      printf("node %d : %.13s\n", rank, message);

    } else {

      // Reciben mensaje por parte del procesador anterior
      rc = MPI_Recv(message, 13, MPI_CHAR, rank - 1, tag, MPI_COMM_WORLD,
                    &status);
      printf("Node %d ha recibido el mensaje : %.13s\n", rank, message);

      // Reenvia el mensaje al rango superior
      if ((rank + 1) >= size) {
        rc = MPI_Send(message, 13, MPI_CHAR, 0, tag, MPI_COMM_WORLD);
      } else {
        rc = MPI_Send(message, 13, MPI_CHAR, rank + 1, tag, MPI_COMM_WORLD);
      }
    }
  } else {
    printf("Numero de procesadores insuficiente (>=1)\n");
  }

  rc = MPI_Finalize();
}
