import { useParams } from 'next/navigation'

function getCurrentOrganization(): string {
    const params = useParams<{ organization: string}>();
    return params.organization;
}

export default getCurrentOrganization;
