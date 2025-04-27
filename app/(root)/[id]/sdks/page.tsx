async function Page({ params }) {
  const { id } = await params;

  return <>{id}</>;
}

export default Page;
