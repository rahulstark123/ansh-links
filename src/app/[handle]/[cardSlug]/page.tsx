import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    handle: string;
    cardSlug: string;
  }>;
};

export default async function PublicCardPage({ params }: PageProps) {
  const { handle, cardSlug } = await params;

  const card = await prisma.card.findFirst({
    where: {
      cardSlug,
      user: {
        handle,
      },
    },
    select: {
      title: true,
      bio: true,
      isLive: true,
      coverImageUrl: true,
    },
  });

  if (!card || !card.isLive) {
    return (
      <main className="min-h-screen bg-[#090d18] px-6 py-16 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#101829] p-8 text-center">
          <h1 className="text-2xl font-semibold">Oops</h1>
          <p className="mt-3 text-white/70">Sorry this card is not live. Please contact the person who shared you.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090d18] px-6 py-12 text-white">
      <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#101829]">
        <div
          className="h-40 bg-cover bg-center"
          style={{ backgroundImage: `url('${card.coverImageUrl || "/image1.svg"}')` }}
        />
        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/80">@{handle}</p>
          <h1 className="mt-2 text-3xl font-semibold">{card.title}</h1>
          <p className="mt-3 text-white/75">{card.bio || "Welcome to this live card."}</p>
        </div>
      </div>
    </main>
  );
}
