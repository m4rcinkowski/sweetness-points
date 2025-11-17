export const formatRelative = (date: Date, locale = navigator.language) => {
    const now = new Date();
    const diffMs = +date - +now;
    const absDiff = Math.abs(diffMs);
    const units: [string, number][] = [
        ['year', 365 * 24 * 60 * 60 * 1000],
        ['month', 30 * 24 * 60 * 60 * 1000],
        ['week', 7 * 24 * 60 * 60 * 1000],
        ['day', 24 * 60 * 60 * 1000],
        ['hour', 60 * 60 * 1000],
        ['minute', 60 * 1000],
        ['second', 1000],
    ];
    for (const [unit, ms] of units) {
        if (absDiff >= ms || unit === 'second') {
            const value = Math.round(diffMs / ms);
            // For 'today', 'yesterday', 'tomorrow'
            if (unit === 'day' && Math.abs(value) <= 1) {
                return `${new Intl.RelativeTimeFormat(locale, {numeric: 'auto'}).format(value, unit)} ${date.toTimeString().slice(0, 5)}`;
            }
            return `${new Intl.RelativeTimeFormat(locale, {numeric: 'auto'}).format(value, unit as Intl.RelativeTimeFormatUnit)}`;
        }
    }
};

export async function compressText(text: string, format = 'gzip') {
    const byteArray = new TextEncoder().encode(text);
    const cs = new CompressionStream(format as CompressionFormat);
    const writer = cs.writable.getWriter();
    writer.write(byteArray);

    writer.close();
    const compressedBuffer = await new Response(cs.readable).arrayBuffer();

    return new Uint8Array(compressedBuffer);
}

export async function decompressText(compressedBytes: BufferSource, format = 'gzip') {
    const ds = new DecompressionStream(format as CompressionFormat);
    const writer = ds.writable.getWriter();
    writer.write(compressedBytes);
    writer.close();
    const decompressedBuffer = await new Response(ds.readable).arrayBuffer();

    return new TextDecoder().decode(decompressedBuffer);
}

