const cn = (...values: (string | undefined | null | false)[]) =>
  values.filter(Boolean).join(" ")

export { cn }
