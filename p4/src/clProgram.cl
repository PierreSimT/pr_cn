kernel void gaussBlur(global uchar *src, global uchar *result, int filas, int columnas, float radius) {

    int i = get_global_id(0);

    //printf("Procesando fila %d \n", i);

    float rs = ceil(radius * 2.57);
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