<?php
namespace App\Enum;
use ArchTech\Enums\Names;

enum Status: string
{
    use Names;

   case PENDING="pending";
    case  DONE= "done";
    case CANCELED = "canceled";
    case InPROGRESS="in-progress";
}
