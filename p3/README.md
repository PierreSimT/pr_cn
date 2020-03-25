# Práctica 3 - Computación en la Nube

- **Nombre**: Pierre Simon Callist Yannick Tondreau
- **Repositorio Git**: [https://github.com/PierreSimT/pr_cn/tree/master/p3](https://github.com/PierreSimT/pr_cn/tree/master/p3)
- **Máster Ingeniería Informática - Universidad de La Laguna**

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

```cpp
Mat gaussBlur(Mat source, float radius)
{
    int columnas = source.cols;
    int filas = source.rows;
    Mat result;
    result.create(filas, columnas, CV_8UC1);
    double rs = ceil(radius * 2.57);

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
```

## 4. Compara las versiones.

### Versión Secuencial

![Ejecucion Secuencial](https://imgur.com/6j02WLo.png)

Como se puede observar en la imagen anterior, la ejecución del programa sólo se realiza en un procesador, por lo tanto no hay paralelización.

![Resultado Secuencial](https://imgur.com/u9EGWxq.png)

El resultado que obtenemos es la imagen seleccionada difuminada y en blanco y negro. Con esta imagen de prueba (de 2816x2112), el programa secuencial dura unos 55 segundos.

### Versión MPI

![Ejecucion Secuencial](https://imgur.com/1wvjiIR.png)

Como se puede observar en la imagen anterior, la ejecución del programa se realiza sobre cuatro procesadores, dado que al ejecutar el programa con `mpirun` se aplica la opción `-np 4`.

![Resultado Secuencial](https://imgur.com/NbXkVFr.png)

El resultado que obtenemos es la imagen seleccionada difuminada y en blanco y negro. Con esta imagen de prueba (de 2816x2112), el programa con paso de mensajes (MPI) dura unos 14 segundos.

### Versión OpenMP

![Ejecucion OpenMP](https://imgur.com/5vPIhTD.png)

Como se puede observar en la imagen anterior, la ejecución del programa sólo se distribuye a cada procesado.

![Resultado Secuencial](https://imgur.com/6SCBam9.png)

El resultado que obtenemos es la imagen seleccionada difuminada y en blanco y negro. Con esta imagen de prueba (de 2816x2112), el programa con OpenMP dura unos 11 segundos.