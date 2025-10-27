import React, { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GetRowIdParams } from "ag-grid-community";
import ToggleRenderer from "./ToggleRenderer";
import { useDataStore } from "../stores/useDataStore";
import type { DataRow, IColDefsSelector, IDataStoreSelector } from "../types";

const MIN_THUMB_HEIGHT = 28;
const MIN_THUMB_WIDTH = 48;

const DataOverviewTable: React.FC = () => {
  const rowData: DataRow[] = useDataStore((s: IDataStoreSelector) => s.rowData);
  const colDefs: ColDef[] = useDataStore((s: IColDefsSelector) => s.colDefs);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const gridWrapperRef = useRef<HTMLDivElement | null>(null);

  // Viewports: vertical viewport (for scrollTop) and horizontal (for scrollLeft)
  const vViewportRef = useRef<HTMLElement | null>(null); // .ag-body-viewport
  const hViewportRef = useRef<HTMLElement | null>(null); // .ag-center-cols-viewport

  const rafRef = useRef<number | null>(null);

  const defaultColDef = useMemo(() => ({ flex: 1, minWidth: 120 }), []);
  const frameworkComponents = useMemo(
    () => ({ toggleRenderer: ToggleRenderer }),
    []
  );
  const getRowId = (p: GetRowIdParams<DataRow>) => p.data.id;

  // vertical thumb state
  const [vThumbHeight, setVThumbHeight] = useState<number>(MIN_THUMB_HEIGHT);
  const [vThumbTop, setVThumbTop] = useState<number>(0);
  const vDraggingRef = useRef(false);
  const vDragStartYRef = useRef(0);
  const vDragStartScrollRef = useRef(0);

  // horizontal thumb state
  const [hThumbWidth, setHThumbWidth] = useState<number>(MIN_THUMB_WIDTH);
  const [hThumbLeft, setHThumbLeft] = useState<number>(0);
  const hDraggingRef = useRef(false);
  const hDragStartXRef = useRef(0);
  const hDragStartScrollRef = useRef(0);

  // Helpers to find AG Grid viewports (try common classes)
  const findViewports = () => {
    if (!gridWrapperRef.current) return { v: null, h: null };
    const v =
      (gridWrapperRef.current.querySelector(
        ".ag-body-viewport"
      ) as HTMLElement | null) ||
      (gridWrapperRef.current.querySelector(".ag-body") as HTMLElement | null);
    const h =
      (gridWrapperRef.current.querySelector(
        ".ag-center-cols-viewport"
      ) as HTMLElement | null) ||
      (gridWrapperRef.current.querySelector(
        ".ag-body-viewport"
      ) as HTMLElement | null);
    return { v, h };
  };

  // update both thumbs
  const updateThumbs = () => {
    const v = vViewportRef.current;
    const h = hViewportRef.current;

    // vertical
    if (v) {
      const clientH = v.clientHeight;
      const scrollH = v.scrollHeight;
      if (scrollH <= 0) {
        setVThumbHeight(clientH);
        setVThumbTop(0);
      } else {
        const ratio = clientH / scrollH;
        const computed = Math.max(
          Math.floor(ratio * clientH),
          MIN_THUMB_HEIGHT
        );
        const maxTop = clientH - computed;
        const scrollable = Math.max(scrollH - clientH, 1);
        const top = (v.scrollTop / scrollable) * maxTop;
        setVThumbHeight(computed);
        setVThumbTop(Number.isFinite(top) ? top : 0);
      }
    }

    // horizontal
    if (h) {
      const clientW = h.clientWidth;
      const scrollW = h.scrollWidth;
      if (scrollW <= 0) {
        setHThumbWidth(clientW);
        setHThumbLeft(0);
      } else {
        const ratio = clientW / scrollW;
        const computed = Math.max(Math.floor(ratio * clientW), MIN_THUMB_WIDTH);
        const maxLeft = clientW - computed;
        const scrollable = Math.max(scrollW - clientW, 1);
        const left = (h.scrollLeft / scrollable) * maxLeft;
        setHThumbWidth(computed);
        setHThumbLeft(Number.isFinite(left) ? left : 0);
      }
    }
  };

  // rAF throttle for scroll updates
  const onViewportScrollRAF = () => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      updateThumbs();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    });
  };

  // Vertical interactions
  const onVTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = vViewportRef.current;
    const track = e.currentTarget;
    if (!v || !track) return;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clientH = v.clientHeight;
    const scrollH = v.scrollHeight;
    const ratio = clickY / clientH;
    const target = Math.max(
      0,
      Math.min(scrollH - clientH, ratio * (scrollH - clientH))
    );
    v.scrollTop = target;
    updateThumbs();
  };

  const onVThumbMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    vDraggingRef.current = true;
    vDragStartYRef.current = e.clientY;
    vDragStartScrollRef.current = vViewportRef.current
      ? vViewportRef.current.scrollTop
      : 0;
    document.body.style.userSelect = "none";
  };
  const onVThumbTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    vDraggingRef.current = true;
    vDragStartYRef.current = e.touches[0].clientY;
    vDragStartScrollRef.current = vViewportRef.current
      ? vViewportRef.current.scrollTop
      : 0;
  };

  // Horizontal interactions
  const onHTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const h = hViewportRef.current;
    const track = e.currentTarget;
    if (!h || !track) return;
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clientW = h.clientWidth;
    const scrollW = h.scrollWidth;
    const ratio = clickX / clientW;
    const target = Math.max(
      0,
      Math.min(scrollW - clientW, ratio * (scrollW - clientW))
    );
    h.scrollLeft = target;
    updateThumbs();
  };

  const onHThumbMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    hDraggingRef.current = true;
    hDragStartXRef.current = e.clientX;
    hDragStartScrollRef.current = hViewportRef.current
      ? hViewportRef.current.scrollLeft
      : 0;
    document.body.style.userSelect = "none";
  };
  const onHThumbTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    hDraggingRef.current = true;
    hDragStartXRef.current = e.touches[0].clientX;
    hDragStartScrollRef.current = hViewportRef.current
      ? hViewportRef.current.scrollLeft
      : 0;
  };

  // Global move/up handlers for dragging (mouse + touch)
  useEffect(() => {
    const onMove = (ev: MouseEvent | TouchEvent) => {
      // vertical drag
      if (vDraggingRef.current && vViewportRef.current) {
        const v = vViewportRef.current;
        const clientH = v.clientHeight;
        const scrollH = v.scrollHeight;
        const thumbH = vThumbHeight;
        const maxThumbTop = Math.max(clientH - thumbH, 1);
        let clientY = 0;
        if (ev instanceof TouchEvent) clientY = ev.touches?.[0]?.clientY ?? 0;
        else clientY = (ev as MouseEvent).clientY;
        const deltaY = clientY - vDragStartYRef.current;
        const deltaRatio = deltaY / maxThumbTop;
        const target = Math.max(
          0,
          Math.min(
            scrollH - clientH,
            vDragStartScrollRef.current + deltaRatio * (scrollH - clientH)
          )
        );
        v.scrollTop = target;
        updateThumbs();
      }

      // horizontal drag
      if (hDraggingRef.current && hViewportRef.current) {
        const h = hViewportRef.current;
        const clientW = h.clientWidth;
        const scrollW = h.scrollWidth;
        const thumbW = hThumbWidth;
        const maxThumbLeft = Math.max(clientW - thumbW, 1);
        let clientX = 0;
        if (ev instanceof TouchEvent) clientX = ev.touches?.[0]?.clientX ?? 0;
        else clientX = (ev as MouseEvent).clientX;
        const deltaX = clientX - hDragStartXRef.current;
        const deltaRatio = deltaX / maxThumbLeft;
        const target = Math.max(
          0,
          Math.min(
            scrollW - clientW,
            hDragStartScrollRef.current + deltaRatio * (scrollW - clientW)
          )
        );
        h.scrollLeft = target;
        updateThumbs();
      }
    };

    const onUp = () => {
      if (vDraggingRef.current || hDraggingRef.current) {
        vDraggingRef.current = false;
        hDraggingRef.current = false;
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [vThumbHeight, hThumbWidth]);

  // find viewports and attach scroll/observers
  useEffect(() => {
    const { v, h } = findViewports();
    vViewportRef.current = v;
    hViewportRef.current = h;

    // If not found immediately, try again shortly (AG Grid may render after mount)
    if (!vViewportRef.current || !hViewportRef.current) {
      const t = setTimeout(() => {
        const found = findViewports();
        vViewportRef.current = found.v;
        hViewportRef.current = found.h;
        if (vViewportRef.current)
          vViewportRef.current.addEventListener("scroll", onViewportScrollRAF, {
            passive: true,
          });
        if (hViewportRef.current)
          hViewportRef.current.addEventListener("scroll", onViewportScrollRAF, {
            passive: true,
          });
        updateThumbs();
      }, 220);
      return () => clearTimeout(t);
    }

    const vvp = vViewportRef.current!;
    const hvp = hViewportRef.current!;

    vvp.addEventListener("scroll", onViewportScrollRAF, { passive: true });
    hvp.addEventListener("scroll", onViewportScrollRAF, { passive: true });

    // Resize observer to handle container/viewport resizing
    const roV = new ResizeObserver(() => updateThumbs());
    const roH = new ResizeObserver(() => updateThumbs());
    roV.observe(vvp);
    roH.observe(hvp);

    // Mutation observer to detect content changes (rows added/removed)
    const moV = new MutationObserver(() => updateThumbs());
    const moH = new MutationObserver(() => updateThumbs());
    moV.observe(vvp, { childList: true, subtree: true });
    moH.observe(hvp, { childList: true, subtree: true });

    // initial compute
    updateThumbs();

    return () => {
      vvp.removeEventListener("scroll", onViewportScrollRAF);
      hvp.removeEventListener("scroll", onViewportScrollRAF);
      roV.disconnect();
      roH.disconnect();
      moV.disconnect();
      moH.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridWrapperRef.current, rowData, colDefs]);

  return (
    <div className="w-full max-w-7xl">
      <div
        ref={containerRef}
        className="rounded-xl border border-gray-300 shadow-md bg-white"
        style={{ position: "relative" }}
      >
        <div className=""></div>

        <div
          ref={gridWrapperRef}
          className="ag-theme-alpine hide-native-scrollbar"
          style={{
            height: 600,
            width: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
            animateRows
            components={frameworkComponents}
            getRowId={getRowId}
            suppressClickEdit={true}
          />
        </div>

        <div
          onMouseDown={onVTrackClick}
          style={{
            position: "absolute",
            right: 8,
            top: 72, // adjust if header height differs
            bottom: 20, // leave room for horizontal track
            width: 12,
            borderRadius: 999,
            background: "rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "flex-start",
            cursor: "pointer",
            padding: 2,
            boxSizing: "border-box",
            zIndex: 40,
          }}
          aria-hidden
        >
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onVThumbMouseDown(e);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              onVThumbTouchStart(e);
            }}
            role="presentation"
            style={{
              width: "100%",
              height: vThumbHeight,
              transform: `translateY(${vThumbTop}px)`,
              background: "rgba(0,0,0,0.28)",
              borderRadius: 999,
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              cursor: "grab",
              touchAction: "none",
            }}
          />
        </div>

        <div
          onMouseDown={onHTrackClick}
          style={{
            position: "absolute",
            left: 12,
            right: 28, // leave space so it doesn't overlap the vertical track
            bottom: 8,
            height: 12,
            borderRadius: 999,
            background: "rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            padding: 2,
            boxSizing: "border-box",
            zIndex: 40,
          }}
          aria-hidden
        >
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onHThumbMouseDown(e);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              onHThumbTouchStart(e);
            }}
            role="presentation"
            style={{
              height: "100%",
              width: hThumbWidth,
              transform: `translateX(${hThumbLeft}px)`,
              background: "rgba(0,0,0,0.28)",
              borderRadius: 999,
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              cursor: "grab",
              touchAction: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DataOverviewTable;
