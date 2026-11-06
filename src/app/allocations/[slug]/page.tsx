import { Suspense } from 'react';
import LgaDetailsClient from './LgaDetailsClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function LgaDetailsPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <LgaDetailsInner params={params} />
    </Suspense>
  );
}

async function LgaDetailsInner({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LgaDetailsClient slug={slug} />;
}
