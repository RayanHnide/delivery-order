export default function getStatusColor(status) {
    switch (status) {
        case "pending": return "bg-[#FFF266] text-black";
        case "canceled": return "bg-[#ff4747]";
        case "in-progress": return "bg-[#66ffff] text-primary";
        default: return "bg-[#91ff66] text-success";
    }
}
