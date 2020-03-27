cuda: 
	nvcc src/main.cu -o bin/cuda.run `pkg-config --libs opencv`

cl: 
	g++ src/main.cpp -o bin/opencl.run `pkg-config --libs opencv` -lOpenCL

runCUDA:
	bin/cuda.run sample3.png 10.0

runCL:
	bin/opencl.run sample3.png 10.0

clean: 
	rm -rf bin/*

all: cuda cl