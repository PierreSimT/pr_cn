#include <stdio.h>
#include <cmath>
#include <chrono>
#include <omp.h>
#include <opencv2/opencv.hpp>

using namespace cv;

Mat gaussBlur(Mat source, float radius, int threads)
{
    int columnas = source.cols;
    int filas = source.rows;
    Mat result;
    result.create(filas, columnas, CV_8UC1);
    double rs = ceil(radius * 2.57);

    omp_set_num_threads(threads);

#pragma omp parallel for shared(source, result, columnas, filas, rs)
    for (int i = 0; i < filas; i++)
    {
        for (int j = 0; j < columnas; j++)
        {
            float val = 0, sum = 0;
            for (int t = i - rs; t < i + rs + 1; t++)
            {
                for (int s = j - rs; s < j + rs + 1; s++)
                {
                    int x = min(columnas - 1, max(0, s));
                    int y = min(filas - 1, max(0, t));

                    float dsq = (s - j) * (s - j) + (t - i) * (t - i);
                    float weight = exp(-dsq / (2.0 * radius * radius)) / (M_PI * 2.0 * radius * radius);

                    val += source.data[y * columnas + x] * weight;
                    sum += weight;
                }

                result.data[i * columnas + j] = round(val / sum);
            }
        }
    }

    return result;
}

int main(int argc, char **argv)
{
    if (argc != 4)
    {
        printf("uso: a.out <Image_Path> <Gauss_Radius> <num_hilos>\n");
        return -1;
    }

    Mat img = imread(argv[1], IMREAD_GRAYSCALE);

    auto t1 = std::chrono::high_resolution_clock::now();
    Mat result = gaussBlur(img, atof(argv[2]), atoi(argv[3]));
    auto t2 = std::chrono::high_resolution_clock::now();

    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(t2 - t1).count();
    std::cout << "Tiempo de ejecucion: " << (float) (duration / 1000.0) << " sec" << std::endl;

    imwrite("result.png", result);
    std::cout << "Resultado escrito en ./result.png" << std::endl;

    return 0;
}