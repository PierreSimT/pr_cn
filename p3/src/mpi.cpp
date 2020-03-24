#include <stdio.h>
#include <cmath>
#include <chrono>
#include <vector>
#include <opencv2/opencv.hpp>

#include "mpi.h"

using namespace cv;

void gaussBlur(Mat *source, Mat *result, float radius)
{
    int columnas = source->cols;
    int filas = source->rows;
    double rs = ceil(radius * 2.57);

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

                    val += source->data[y * columnas + x] * weight;
                    sum += weight;
                }

                result->data[i * columnas + j] = round(val / sum);
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

    int rank, size, tag, rc, i;
    double startwtime, endwtime, prodtime;
    MPI_Status status;
    char message[20];

    rc = MPI_Init(&argc, &argv);
    rc = MPI_Comm_size(MPI_COMM_WORLD, &size);
    rc = MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    tag = 100;

    Mat *img;
    Mat *result;
    vector<uchar> *sub_result;
    vector<uchar> *sub_img;

    img = new Mat(imread(argv[1], IMREAD_GRAYSCALE));
    if (!img->data)
        exit(-1);

    result = new Mat(img->rows, img->cols, CV_8UC1);

    int elements_per_proc = img->total() / size;

    sub_img = new vector<uchar>(elements_per_proc);
    sub_result = new vector<uchar>(elements_per_proc);

    startwtime = MPI_Wtime();
    MPI_Scatter(img->data, elements_per_proc, MPI_BYTE, sub_img->data(), elements_per_proc, MPI_BYTE, 0, MPI_COMM_WORLD);

    Mat *aux_img = new Mat(*sub_img);
    Mat *aux_result = new Mat(*sub_result);

    gaussBlur(aux_img, aux_result, atof(argv[2]));

    MPI_Barrier(MPI_COMM_WORLD);

    MPI_Gather(aux_result->data, elements_per_proc, MPI_BYTE, result->data, elements_per_proc, MPI_BYTE, 0, MPI_COMM_WORLD);
    endwtime = MPI_Wtime();

    if (rank == 0)
    {
        imwrite("result.png", *result);
        std::cout << "Resultado escrito en ./result.png" << std::endl;

        std::cout << "Elapsed time is: " << endwtime - startwtime << std::endl;
    }

    delete aux_img;
    delete aux_result;
    delete sub_result;
    delete sub_img;
    delete result;
    delete img;

    rc = MPI_Finalize();
    return 0;
}
