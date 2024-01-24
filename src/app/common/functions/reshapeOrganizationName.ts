export default function reshapeOrganizationName(
  organizationName: string | undefined,
): string | undefined {
  return organizationName
    ?.toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s/g, "");
}
