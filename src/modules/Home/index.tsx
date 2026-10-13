import Link from 'next/link';

const Home = () => {
  return (
    <div className='mx-auto flex min-h-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16'>
      <main className='flex flex-col gap-6 sm:gap-8'>
        <div className='flex flex-col gap-4'>
          <p className='text-sm font-medium uppercase tracking-wider text-foreground/60'>
            Học tên Pokémon
          </p>
          <h1 className='text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl'>
            Khám phá ý nghĩa tên tiếng Nhật
          </h1>
          <p className='max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg'>
            Tra cứu tên Nhật và Anh, vùng xuất hiện, giải thích nghĩa đen và chơi
            chữ — và nghe đọc bằng giọng tiếng Việt trực tiếp trên trình duyệt.
          </p>
        </div>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <Link
            href='/name'
            className='inline-flex min-h-11 w-full items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:opacity-90 sm:w-auto sm:min-w-44 sm:text-base'
          >
            Xem danh sách
          </Link>
        </div>
        <ul className='grid gap-3 text-sm text-foreground/70 sm:grid-cols-3 sm:gap-4 sm:text-base'>
          <li className='rounded-lg border border-foreground/10 px-4 py-3'>
            Tên JP / EN và số thứ tự
          </li>
          <li className='rounded-lg border border-foreground/10 px-4 py-3'>
            Nghĩa tên và vùng (Kanto, …)
          </li>
          <li className='rounded-lg border border-foreground/10 px-4 py-3'>
            Nút Play — đọc nghĩa (TTS)
          </li>
        </ul>
      </main>
    </div>
  );
};

export default Home;
