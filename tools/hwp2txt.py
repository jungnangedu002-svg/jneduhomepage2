import sys, olefile, zlib, struct
f = olefile.OleFileIO(sys.argv[1])
hdr = f.openstream('FileHeader').read()
compressed = hdr[36] & 1
out=[]
secs = sorted([e for e in f.listdir() if e[0]=='BodyText'], key=lambda e:int(e[1][7:]))
for s in secs:
    d = f.openstream(s).read()
    if compressed: d = zlib.decompress(d, -15)
    i=0
    while i < len(d):
        h = struct.unpack_from('<I', d, i)[0]; i+=4
        tag = h & 0x3ff; size = (h>>20)&0xfff
        if size==0xfff: size=struct.unpack_from('<I',d,i)[0]; i+=4
        if tag==67:
            t = d[i:i+size].decode('utf-16le','ignore')
            t=''.join(c for c in t if ord(c)>=32 or c=='\n')
            out.append(t)
        i+=size
print('\n'.join(out))
