type FormspreePayload = Record<string, FormDataEntryValue>

export async function submitFormspree(
  endpoint: string,
  data: FormData | FormspreePayload,
): Promise<{ ok: boolean; message: string }> {
  const body = data instanceof FormData ? Object.fromEntries(data.entries()) : data

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      return { ok: true, message: 'Thank you — we’ll be in touch shortly.' }
    }

    const json = (await res.json().catch(() => null)) as { error?: string } | null
    return {
      ok: false,
      message: json?.error || 'Something went wrong. Please try again or call us.',
    }
  } catch {
    return {
      ok: false,
      message: 'Unable to send right now. Please email us or call (908) 797-1777.',
    }
  }
}
