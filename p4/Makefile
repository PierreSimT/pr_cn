build: 
	nvcc src/main.cu -o bin/cuda.run `pkg-config --libs opencv`

run:
	bin/cuda.run sample3.png 2.5

clean: 
	rm -rf bin/*

all: mp openmp main
