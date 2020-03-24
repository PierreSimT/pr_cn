# Práctica 3 - Computación en la Nube

## 1. Desarrolla un algoritmo que desarrolle un algoritmo de tratamiento de imágenes/vídeo.

El algoritmo que se ha decidido desarrollar es el **Desenfoque Gaussiano** o también llamado **Alisamiento Gaussiano** es un algoritmo que hace uso de la [función Gaussiana](https://en.wikipedia.org/wiki/Gaussian_function) para emborronarla. Es un efecto que se usa ampliamente en software de manipulación de imágenes, usado típicamente para reducir el ruido y el detalle de una imagen.

A continuación se muestra la implementación secuencial del algoritmo: 

```cpp
Mat gaussBlur(Mat source, float radius) {
    int columnas = source.cols;
    int filas = source.rows;
    Mat result;
    result.create(filas, columnas, CV_8UC1);
    double rs = ceil(radius * 2.57);

    for (int i = 0; i < filas; i++) {
        for (int j = 0; j < columnas; j++) {
            float val = 0, sum = 0;
            for (int t = i - rs; t < i + rs + 1; t++) {
                for (int s = j - rs; s < j + rs + 1; s++) {
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
```

## 2. Implementa una versión MPI para este algoritmo.

```cpp
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
```

## 3. Desarrolla una versión OpenMP para este algoritmo.

## 4. Compara ambas versiones.