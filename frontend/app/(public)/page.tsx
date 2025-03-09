'use client'

import { Client } from '@stomp/stompjs';
import { useEffect } from 'react';
import Link from 'next/link';
import TextGlitchEffect from '@/components/style/TextGlitchEffect';

export default function Home() {

  return (
    <div className='mt-10'>
      <div className='w-fit m-auto'>
        <div className='flex flex-col justify-start mb-3 gap-y-3 xl:text-base text-sm'>
          <div>$ WELCOME TO HIVE_MIND.TMP</div>
          <Link href="/login" className='hover:text-[#C0C0C0]'>
            {'>'} <TextGlitchEffect text='Login to hive' />
          </Link>
          <div>
          <Link href="/register" className='hover:text-[#C0C0C0]'>
            {'>'} <TextGlitchEffect text='New user? create account' interval={15} />
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}