<?php
namespace App\Enum;
use ArchTech\Enums\Names;

enum Units: string
{
    use Names;

   case kg="kg";
    case  PRICE= "piece";
    case LITRE = "litre";
    case BOX="box";
    case METER="meter";
}
