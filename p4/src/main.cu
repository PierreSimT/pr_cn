#include <stdio.h>
#include <cmath>
#include <chrono>
#include <opencv2/opencv.hpp>

using namespace cv;

__global__ void gaussBlurCUDA(uchar * src, uchar * result, size_t filas, size_t columnas, float radius) {

    int i = blockIdx.x * blockDim.x + threadIdx.x;

    //printf("Procesando fila %d \n", i);

    double rs = ceil(radius * 2.57);
    if ( i < filas ) {
        for (int j = 0; j < columnas; j++) {       
            float val = 0, sum = 0;
            for (int t = i - rs; t < i + rs + 1; t++)
            {
                for (int s = j - rs; s < j + rs + 1; s++)
                {
                    int x = min((int)columnas - 1, max(0, s));
                    int y = min((int)filas - 1, max(0, t));

                    float dsq = (s - j) * (s - j) + (t - i) * (t - i);
                    float weight = exp(-dsq / (2.0 * radius * radius)) / (M_PI * 2.0 * radius * radius);

                    val += src[y * columnas + x] * weight;
                    sum += weight;
                }

                result[i * columnas + j] = round(val / sum);
            }
        }
    }

}

int main(int argc, char **argv)
{
    if (argc != 3)
    {
        printf("uso: a.out <Image_Path> <Gauss_Radius>\n");
        return -1;
    }

    Mat img = imread(argv[1], CV_LOAD_IMAGE_GRAYSCALE);

    Mat *resultCPU = new Mat(img.rows, img.cols, CV_8UC1);

    float radius = atof(argv[2]);
    uchar * src;
    uchar * result;

    // PREPARAR DATOS CUDA
    cudaMalloc(&src, img.total() * sizeof(uchar));
    cudaMalloc(&result, img.total() * sizeof(uchar));
    cudaMemcpy(src, img.data, img.total() * sizeof(uchar), cudaMemcpyHostToDevice);
    
    // PREPARAR GRIDS, BLOQUES Y THREADS
    int numBloques = 16;
    dim3 threadsPerBlock(img.rows / numBloques);

    std::cout << "Ejecutando filtro Gaussiano..." << std::endl;

    auto t1 = std::chrono::high_resolution_clock::now();
    gaussBlurCUDA<<<numBloques, threadsPerBlock>>>(src, result, img.rows, img.cols, radius);
    cudaMemcpy(resultCPU->data, result, img.total(), cudaMemcpyDeviceToHost);
    auto t2 = std::chrono::high_resolution_clock::now();

    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(t2 - t1).count();
    std::cout << "Tiempo de ejecucion: " << (float) (duration / 1000.0) << " sec" << std::endl;

    imwrite("result.png", *resultCPU);
    std::cout << "Resultado escrito en ./result.png" << std::endl;

    // FINALIZAR CUDA
    cudaFree(src);
    cudaFree(result);
    
    return 0;
}