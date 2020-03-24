mp: 
	mpic++ src/mpi.cpp -o bin/mpi.run `pkg-config --libs opencv`

openmp:
	g++ src/openmp.cpp -o bin/openmp.run `pkg-config --libs opencv` -fopenmp

main:
	g++ src/main.cpp -o bin/main.run `pkg-config --libs opencv`

runmpi:
	mpirun -np 4 bin/mpi.run image.jpeg 2.5

runmp:
	bin/openmp.run image.jpeg 2.5

run:
	bin/main.run image.jpeg 2.5

clean: 
	rm -rf bin/*

all: mp openmp main
