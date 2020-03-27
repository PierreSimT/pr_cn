#include <cmath>
#include <chrono>
#include <stdio.h>
#include <fstream>
#include <iostream>
#include <CL/cl.hpp>
#include <sys/stat.h>
#include <opencv2/opencv.hpp>

using namespace cv;

char* readCLSource(const char* shaderFile, int &size)
{
    struct stat statBuf;
    stat(shaderFile, &statBuf);

    std::ifstream f(shaderFile);
    
    if (!f)
        return 0;
    
    char *buf = (char*) new char[statBuf.st_size + 1];
    f.read(buf, statBuf.st_size);
    buf[statBuf.st_size] = '\0';
    
    //std::cout << std::string(buf, statBuf.st_size) << std::endl;

    size = statBuf.st_size + 1;

    return buf;
}

int main(int argc, char **argv)
{
    if (argc != 3)
    {
        printf("uso: a.out <Image_Path> <Gauss_Radius>\n");
        return -1;
    }

    // --------------- INICIALIZACION DE OPENCL ------------------
    std::vector<cl::Platform> all_platforms;
    cl::Platform::get(&all_platforms);

    if ( all_platforms.size() == 0 ) {
        printf("No se han encontrado plataformas para ejecutar OpenCL");
        exit(1);
    }

    cl::Platform default_platform = all_platforms[0];
    std::cout << "Using platform: "<< default_platform.getInfo<CL_PLATFORM_NAME>() << "\n";

    std::vector<cl::Device> all_devices;
    
    default_platform.getDevices(CL_DEVICE_TYPE_GPU, &all_devices);

    if (all_devices.size() == 0 ) {
        printf("No se han encontrado dispositivos para ejecutar OpenCL");
        exit(1);
    }

    cl::Device default_device = all_devices[0];
    std::cout << "Using device: " << default_device.getInfo<CL_DEVICE_NAME>() << "\n";

    cl::Context context({default_device});

    cl::Program::Sources sources;

    int size = 0;
    char *kernel_code = readCLSource("/home/ptondreau/Documents/pr_cn/p4/src/clProgram.cl", size);

    // sources.push_back({})

    sources.push_back({kernel_code, size});

    cl::Program program(context, sources);

    if( program.build({default_device})!=CL_SUCCESS ) {
        std::cout <<" Error building: " << program.getBuildInfo<CL_PROGRAM_BUILD_LOG>(default_device) << "\n";
        exit(1);
    }

    // --------------- PREPARACION DATOS PARA OPENCL ------------------

    float radius = atof(argv[2]);
    Mat img = imread(argv[1], CV_LOAD_IMAGE_GRAYSCALE);
    Mat *resultCPU = new Mat(img.rows, img.cols, CV_8UC1);

    // BUFFERS
    cl::Buffer sourceGPU(context, CL_MEM_READ_WRITE, img.total() * sizeof(uchar));
    cl::Buffer resultGPU(context, CL_MEM_READ_WRITE, img.total() * sizeof(uchar));

    cl::CommandQueue queue(context, default_device);

    queue.enqueueWriteBuffer(sourceGPU, CL_TRUE, 0, img.total() * sizeof(uchar), img.data);

    // --------------- ESTABLECER PARAMETROS PARA OPENCL ------------------

    // cl_uint num_filas = img.rows;
    // cl_uint num_columnas = img.cols;
    // cl_float cl_radius = radius;

    // err |= clSetKernelArg(kernel, 0, sizeof(cl_mem), &sourceGPU);
    // err |= clSetKernelArg(kernel, 1, sizeof(cl_mem), &resultGPU);
    // err |= clSetKernelArg(kernel, 2, sizeof(cl_uint), &num_filas);
    // err |= clSetKernelArg(kernel, 3, sizeof(cl_uint), &num_columnas);
    // err |= clSetKernelArg(kernel, 4, sizeof(cl_float), &cl_radius);

    // if ( err != CL_SUCCESS ) {
    //     printf("Error al establecer los parametros\n");
    //     return -1;
    // } else {
    //     printf("Argumentos establecidos\n");
    // }

    // --------------- EJECUCION KERNEL OPENCL ------------------

    cl_uint dim = 1;
    size_t local = 1;
    size_t global = img.rows;

    std::cout << "Ejecutando filtro Gaussiano..." << std::endl;

    auto t1 = std::chrono::high_resolution_clock::now();
    // err = clEnqueueNDRangeKernel(commands, kernel, dim, NULL, &global, &local, 0, NULL, NULL);
    
    cl::Kernel kernel_gauss = cl::Kernel(program, "gaussBlur");
    kernel_gauss.setArg(0, sourceGPU);
    kernel_gauss.setArg(1, resultGPU);
    kernel_gauss.setArg(2, img.rows);
    kernel_gauss.setArg(3, img.cols);
    kernel_gauss.setArg(4, radius);
    queue.enqueueNDRangeKernel(kernel_gauss, cl::NullRange, cl::NDRange(img.rows), cl::NullRange);
    queue.finish();

    queue.enqueueReadBuffer(resultGPU, CL_TRUE, 0, img.total() * sizeof(uchar), resultCPU->data);

    auto t2 = std::chrono::high_resolution_clock::now();

    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(t2 - t1).count();
    std::cout << "Tiempo de ejecucion: " << (float) (duration / 1000.0) << " sec" << std::endl;

    imwrite("result.png", *resultCPU);
    std::cout << "Resultado escrito en ./result.png" << std::endl;
    
    return 0;
}