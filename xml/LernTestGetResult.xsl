<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:decimal-format name="f1" decimal-separator=","/>
  <xsl:output method="html" encoding="UTF-8"/>
  <xsl:variable name="str_id" select="'unknown'"/>
  <xsl:template match="/">
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta xmlns:cxp="http://www.tenbusch.info/cxproc" http-equiv="cache-control" content="no-cache"/>
        <meta xmlns:cxp="http://www.tenbusch.info/cxproc" http-equiv="pragma" content="no-cache"/>
        <title>LernTest: Ergebnisse von %CGIID%</title>
        <link xmlns:cxp="http://www.tenbusch.info/cxproc" rel="stylesheet" type="text/css" href="/LernTest.css"/>
      </head>
      <body>
        <center>
          <table cellpadding="4" width="90%">
            <tr>
              <th colspan="3">
                <xsl:value-of select="concat('Ergebnisse von ',$str_id)"/>
              </th>
            </tr>
            <xsl:apply-templates select="calendar/year"/>
          </table>
        </center>
      </body>
    </html>
  </xsl:template>
  <xsl:template match="year">
    <tr>
      <th colspan="3">
        <xsl:value-of select="@ad"/>
      </th>
    </tr>
    <xsl:apply-templates/>
  </xsl:template>
  <xsl:template match="month">
    <tr>
      <th colspan="3">
        <xsl:value-of select="concat(@name,' ',parent::year/@ad)"/>
      </th>
    </tr>
    <xsl:apply-templates/>
  </xsl:template>
  <xsl:template match="day">
    <tr>
      <td colspan="3">
        <xsl:choose>
          <xsl:when test="@today='yes'">
            <a name="today">
              <xsl:value-of select="concat(number(@om),'.')"/>
            </a>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="concat(number(@om),'.')"/>
          </xsl:otherwise>
        </xsl:choose>
      </td>
    </tr>
    <xsl:apply-templates select="col/file/pie/table">
      <xsl:sort select="tr[1]/th[1]"/>
      <xsl:sort select="position()"/>
    </xsl:apply-templates>
  </xsl:template>
  <xsl:template match="table">
    <xsl:variable name="int_all" select="count(tr[td])"/>
    <xsl:variable name="int_ok" select="count(tr[td[2]='1'])"/>
    <xsl:variable name="int_time" select="substring-before(tr[1]/th[3],'s') div $int_all"/>
    <tr>
      <td>
        <xsl:value-of select="concat(tr[1]/th[1],' ', tr[1]/th[4])"/>
      </td>
      <td>
        <xsl:if test="not(tr[1]/th[3]='')">
          <xsl:value-of select="tr[1]/th[3]"/>
        </xsl:if>
        <xsl:if test="$int_time &gt; 0">
          <xsl:value-of select="concat(' (= ',format-number($int_time,'##0,0','f1'),' s)')"/>
        </xsl:if>
      </td>
      <td>
        <xsl:value-of select="concat($int_ok,' von ', $int_all, ' = ', format-number(($int_ok div $int_all * 100.0),'##0,0','f1'), '%')"/>
      </td>
    </tr>
  </xsl:template>
  <xsl:template match="*"/>
</xsl:stylesheet>
