export async function checkUrlLogoAtivo(url?: string): Promise<boolean> {
  try {
    if (!url)
      return false;
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error ao buscar logo do ativo:', error);
    return false;
  }
}
