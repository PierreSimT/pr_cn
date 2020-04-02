mp: 
	mpic++ src/mpi.cpp -o bin/mpi.run `pkg-config --libs opencv` -std=c++11

openmp:
	g++ src/openmp.cpp -o bin/openmp.run `pkg-config --libs opencv` -fopenmp -std=c++11

main:
	g++ src/main.cpp -o bin/main.run `pkg-config --libs opencv` -std=c++11

mpirun:
	mpirun -np 4 bin/mpi.run image.jpeg 2.5

mprun:
	bin/openmp.run image.jpeg 2.5 8

run:
	bin/main.run image.jpeg 2.5

clean: 
	rm -rf bin/*

all: mp openmp main
