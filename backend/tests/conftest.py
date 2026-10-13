"""Local regression tests cannot reach hosted services; live tests remain opt-in."""

import socket

import pytest


@pytest.fixture(autouse=True)
def offline_transport_only(request, monkeypatch):
    if "/integration/" in str(request.node.path).replace("\\", "/"):
        return

    def blocked(*_args, **_kwargs):
        raise AssertionError("Local tests must inject an offline transport, not contact a provider.")

    monkeypatch.setattr(socket, "create_connection", blocked)
    connect = socket.socket.connect

    def local_only(sock, address):
        # Windows asyncio implements its internal socketpair over loopback TCP.
        if isinstance(address, tuple) and address[0] in {"127.0.0.1", "::1", "localhost"}:
            return connect(sock, address)
        return blocked()

    monkeypatch.setattr(socket.socket, "connect", local_only)
