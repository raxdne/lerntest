/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Theme.define("lerntest.theme.Font",
{
  extend : qx.theme.modern.Font,

  fonts :
  {
    "default" :
    {
      size : 14,
      lineHeight : 1.4,
      family : [ "Tahoma", "Liberation Sans", "Arial" ]
    },

    "bold" :
    {
      size : 14,
      lineHeight : 1.4,
      family : [ "Tahoma", "Liberation Sans", "Arial" ],
      bold : true
    }
  }
});